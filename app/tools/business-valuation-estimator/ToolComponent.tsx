"use client"
import React, { useCallback, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/components/toast"
import { Download, Copy } from "lucide-react"

interface FormState {
  name: string
  industry: string
  revenue: string
  profit: string
  growth: string
  ebitdaMultiple: number
  revenueMultiple: number
}

const initialState: FormState = {
  name: "Acme Corp",
  industry: "SaaS",
  revenue: "750000",
  profit: "150000",
  growth: "8",
  ebitdaMultiple: 7,
  revenueMultiple: 3,
}

function useValuation(state: FormState) {
  const revenue = parseFloat(state.revenue) || 0
  const profit = parseFloat(state.profit) || 0
  const eMult = state.ebitdaMultiple || 0
  const rMult = state.revenueMultiple || 0

  const ebitdaValuation = profit * eMult
  const revenueValuation = revenue * rMult
  const averageValuation = (ebitdaValuation + revenueValuation) / 2
  return { revenue, profit, eMult, rMult, ebitdaValuation, revenueValuation, averageValuation }
}

const AnimatedNumber = ({ value }: { value: number }) => {
  return (
    <motion.span
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {value.toLocaleString(undefined, {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      })}
    </motion.span>
  )
}

export default function ToolComponent() {
  const [form, setForm] = useState<FormState>(initialState)
  const resultRef = useRef<HTMLDivElement | null>(null)
  const { ebitdaValuation, revenueValuation, averageValuation } = useValuation(form)
  const { push, node: toastNode } = useToast()

  const revenueNum = parseFloat(form.revenue) || 0
  const profitNum = parseFloat(form.profit) || 0
  const invalid = revenueNum <= 0 || profitNum <= 0 || form.ebitdaMultiple <= 0 || form.revenueMultiple <= 0

  const chartData = useMemo(
    () => [
      { label: "EBITDA", value: ebitdaValuation },
      { label: "Revenue", value: revenueValuation },
      { label: "Average", value: averageValuation },
    ],
    [ebitdaValuation, revenueValuation, averageValuation]
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSliderChange = (name: "ebitdaMultiple" | "revenueMultiple") => (value: number[]) => {
    setForm((prev) => ({ ...prev, [name]: value[0] }))
  }

  const copyResults = useCallback(() => {
    const lines = [
      `Business Valuation Report for ${form.name || "N/A"}`,
      `Industry: ${form.industry || "N/A"}`,
      `---`,
      `Annual Revenue: $${Number(form.revenue || 0).toLocaleString()}`,
      `Annual Profit (EBITDA): $${Number(form.profit || 0).toLocaleString()}`,
      `Growth Rate: ${form.growth || 0}%`,
      `---`,
      `EBITDA Multiple: ${form.ebitdaMultiple}x`,
      `Revenue Multiple: ${form.revenueMultiple}x`,
      `---`,
      `EBITDA-based Valuation: $${ebitdaValuation.toLocaleString()}`,
      `Revenue-based Valuation: $${revenueValuation.toLocaleString()}`,
      `Average Valuation: $${averageValuation.toLocaleString()}`,
    ].join("\n")
    navigator.clipboard.writeText(lines).then(
      () => {
        push("Copied to clipboard!", "The valuation summary is ready to paste.")
      },
      () => {
        push("Copy Failed", "Could not copy results to clipboard.")
      }
    )
  }, [form, ebitdaValuation, revenueValuation, averageValuation, push])

  const downloadPDF = useCallback(async () => {
    if (!resultRef.current) return
    push("Generating PDF...", "Please wait a moment.")
    try {
      const canvas = await html2canvas(resultRef.current, {
        scale: 2,
        backgroundColor: null, // Use parent background
        useCORS: true,
      })
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const margin = 40
      const imgWidth = pdfWidth - margin * 2
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      
      pdf.setFont("helvetica", "bold")
      pdf.setFontSize(24)
      pdf.text("Business Valuation Report", pdfWidth / 2, margin + 10, { align: "center" })

      pdf.setFont("helvetica", "normal")
      pdf.setFontSize(12)
      pdf.text(`For: ${form.name || "N/A"} (${form.industry || "N/A"})`, pdfWidth / 2, margin + 30, { align: "center" })

      pdf.addImage(imgData, "PNG", margin, margin + 50, imgWidth, Math.min(imgHeight, pdfHeight - margin * 2 - 50))
      
      const filename = `${form.name.replace(/\s+/g, "-").toLowerCase() || "valuation"}-report.pdf`
      pdf.save(filename)
    } catch (err) {
      console.error(err)
      push("PDF Generation Failed", "An error occurred while creating the PDF.")
    }
  }, [form.name, form.industry, push])

  return (
    <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start min-w-0">
        {/* Left Column: Controls */}
  <Card className="lg:col-span-2 sticky top-24 min-w-0 overflow-hidden">
          <CardHeader>
            <CardTitle>Valuation Inputs</CardTitle>
            <CardDescription>Adjust the financial inputs and market multiples to calculate valuation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Business Name</Label>
                <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Acme Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" name="industry" value={form.industry} onChange={handleChange} placeholder="e.g., SaaS" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue ($)</Label>
                <Input id="revenue" name="revenue" type="number" value={form.revenue} onChange={handleChange} placeholder="e.g., 1,000,000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profit">Annual Profit/EBITDA ($)</Label>
                <Input id="profit" name="profit" type="number" value={form.profit} onChange={handleChange} placeholder="e.g., 250,000" />
              </div>
            </div>
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="ebitdaMultiple">EBITDA Multiple</Label>
                  <span className="text-sm font-medium text-primary">{form.ebitdaMultiple.toFixed(1)}x</span>
                </div>
                <Slider
                  id="ebitdaMultiple"
                  name="ebitdaMultiple"
                  min={1}
                  max={30}
                  step={0.5}
                  value={[form.ebitdaMultiple]}
                  onValueChange={handleSliderChange("ebitdaMultiple")}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="revenueMultiple">Revenue Multiple</Label>
                  <span className="text-sm font-medium text-primary">{form.revenueMultiple.toFixed(1)}x</span>
                </div>
                <Slider
                  id="revenueMultiple"
                  name="revenueMultiple"
                  min={0.5}
                  max={15}
                  step={0.25}
                  value={[form.revenueMultiple]}
                  onValueChange={handleSliderChange("revenueMultiple")}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Results */}
        <div className="lg:col-span-3 space-y-8 min-w-0" ref={resultRef}>
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Valuation Summary</CardTitle>
              <CardDescription>The estimated valuation based on the provided inputs.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center min-w-0">
                <div className="p-4 bg-secondary/50 rounded-lg min-w-0 overflow-hidden">
                  <p className="text-sm text-muted-foreground">EBITDA Valuation</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary tabular-nums truncate"><AnimatedNumber value={ebitdaValuation} /></p>
                </div>
                <div className="p-4 bg-secondary/50 rounded-lg min-w-0 overflow-hidden">
                  <p className="text-sm text-muted-foreground">Revenue Valuation</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary tabular-nums truncate"><AnimatedNumber value={revenueValuation} /></p>
                </div>
                <div className="p-4 bg-primary text-primary-foreground rounded-lg ring-2 ring-primary/50 ring-offset-2 ring-offset-background min-w-0 overflow-hidden">
                  <p className="text-sm opacity-80">Average Valuation</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold tabular-nums truncate"><AnimatedNumber value={averageValuation} /></p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visual Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground) / 0.2)" />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <YAxis
                      tickFormatter={(value) => `$${(Number(value) / 1000).toLocaleString()}k`}
                      axisLine={false}
                      tickLine={false}
                      width={80}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip
                      cursor={{ fill: "hsl(var(--accent))" }}
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                      formatter={(value) => [
                        new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        }).format(Number(value)),
                        "Valuation",
                      ]}
                    />
                    <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]}>
                      <LabelList
                        dataKey="value"
                        position="top"
                        formatter={(value: number) =>
                          `$${(value / 1000).toFixed(0)}k`
                        }
                        className="fill-foreground text-xs"
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start text-xs text-muted-foreground space-y-1">
                <p>EBITDA Valuation = Profit × EBITDA Multiple</p>
                <p>Revenue Valuation = Revenue × Revenue Multiple</p>
            </CardFooter>
          </Card>
          
          <div className="flex flex-wrap gap-4 justify-end">
            <Button variant="outline" onClick={copyResults} disabled={invalid}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Results
            </Button>
            <Button onClick={downloadPDF} disabled={invalid}>
              <Download className="mr-2 h-4 w-4" />
              Download PDF Report
            </Button>
          </div>
        </div>
      </div>
      {toastNode}
    </div>
  )
}

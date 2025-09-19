import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t py-10 mt-20 bg-gradient-to-br from-background via-background to-background/50">
      <div className="container px-4 grid gap-8 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <h3 className="font-semibold mb-2">Toolopia</h3>
          <p className="text-sm text-muted-foreground">Fast, free, and privacy-friendly utilities.</p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Links</h4>
          <ul className="space-y-1 text-sm">
            <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
            <li><Link href="/tools" className="hover:text-primary">All Tools</Link></li>
          </ul>
        </div>
        {/* <div>
          <h4 className="font-medium mb-2">Follow</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-primary">Twitter</a></li>
            <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a></li>
          </ul>
        </div> */}
      </div>
  <div className="container px-4 mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} Toolopia. All rights reserved.</div>
    </footer>
  )
}

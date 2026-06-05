import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home01Icon, Settings01Icon, PlayIcon } from '@hugeicons/core-free-icons'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <HugeiconsIcon icon={PlayIcon} className="h-5 w-5 text-primary" />
            </div>
            <span className="inline-block font-black text-xl tracking-tighter bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
              StreamScope
            </span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link href="/" className="text-sm font-semibold transition-colors text-muted-foreground hover:text-primary flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-muted/50">
              <HugeiconsIcon icon={Home01Icon} size={16} /> Home
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="hover:bg-muted/50 text-muted-foreground hover:text-foreground rounded-lg">
              <HugeiconsIcon icon={Settings01Icon} size={20} />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

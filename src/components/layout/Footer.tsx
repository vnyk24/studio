export default function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SyncStream. All rights reserved.</p>
        <p className="text-sm">Watch together, anywhere.</p>
      </div>
    </footer>
  );
}

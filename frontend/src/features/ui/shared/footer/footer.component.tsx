interface FooterProps {
  brand: string,
  copyright: string
}

const date = new Date().getFullYear();

export function FooterComponent({ brand, copyright }: FooterProps) {

  return (
    <footer className="mx-auto my-0 flex w-full max-w-7xl justify-center p-4">
      &copy; {date} {brand} - {copyright}
    </footer>
  )
}

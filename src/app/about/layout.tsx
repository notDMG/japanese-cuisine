interface IProps {
  children: React.ReactNode
}

export default function LayoutAbout({ children }: IProps) {
  return <section>{children}</section>
}

interface IProps {
  children: React.ReactNode
}

export default function LayoutRecipes({ children }: IProps) {
  return <section>{children}</section>
}

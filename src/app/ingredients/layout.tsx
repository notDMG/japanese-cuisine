interface IProps {
  children: React.ReactNode
}

export default function LayoutIngredients({ children }: IProps) {
  return <section>{children}</section>
}

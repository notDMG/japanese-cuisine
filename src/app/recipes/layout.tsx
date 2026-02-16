interface IProps {
  children: React.ReactNode
}

export default function LayotRecipes({ children }: IProps) {
  return (
    <section>{ children }</section>
  )
}
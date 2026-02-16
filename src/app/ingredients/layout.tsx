interface IProps {
  children: React.ReactNode
}

export default function LayotIngredients({ children }: IProps) {
  return (
    <section>{ children }</section>
  )
}
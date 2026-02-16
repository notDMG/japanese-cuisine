interface IProps {
  children: React.ReactNode
}

export default function LayotAbout({ children }: IProps) {
  return (
    <section>{ children }</section>
  )
}
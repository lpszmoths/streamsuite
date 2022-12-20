export interface ErrorPageProps {
  errorMessage: string
}

export default function ErrorPage(
  { errorMessage }: ErrorPageProps
) {
  return (
    <div>
      <main
        id='main'
        className='error'
      >
        <h1>Error</h1>
        <p>{errorMessage}</p>
      </main>
    </div>
  )
}

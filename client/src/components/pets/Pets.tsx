

const Pets = () => {
  return (
    <>
      <h1>Pets</h1>
      <p>
        Another header.
      </p>
      <main className="mt-16">
        <ul className="grid gap-16 max-w-4xl mx-auto">
          <li>
            {"todo IMAGE HERE pets"}
            <div>
              <span className="text-blue-400 uppercase tracking-wider text-sm font-medium">
                Status ( dead or alive )
              </span>

              <h2 className="text-3xl font-semibold leading-snug tracking-tight mt-1 ">
                Name ( pet name // if dead, text red if alive text green )
              </h2>

              <div className="flex gap-2 mt-3">
                <span className="text-gray-400">
                  Type (  dog or cat )
                </span>
              </div>
            </div>
          </li>
        </ul>
      </main>
    </>
  )
}

export default Pets
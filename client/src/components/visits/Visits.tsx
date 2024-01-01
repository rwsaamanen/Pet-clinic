import { Separator } from "../ui/separator";

export function Index() {
  return (
    <div className="w-full">
      <div className="mx-auto max-w-2xl pb-12 px-4 text-primary w-full">
        <div id="welcome" className="mt-10">
          <h1 className="text-6xl font-medium leading-tight text-center">
            <span className="block">You&apos;re Visits</span>
          </h1>
        </div>

        <Separator />

        <div id="hero" className="rounded-lg mt-14 grid grid-cols-1 p-2 items-center bg-secondary border shadow-lg">
          <div>
            <h2 className="text-3xl leading-8 relative">
              {/* SVG */}
              <span className="ml-10">Todays Visit&apos;s</span>
            </h2>
            <div className="px-5">
              List todays visists ; todo
            </div>
          </div>
        </div>

        <div id="hero" className="rounded-lg mt-14 grid grid-cols-1 p-2 items-center bg-secondary border shadow-lg">
          <div>
            <h2 className="text-3xl leading-8 relative">
              {/* SVG */}
              <span className="ml-10">Upcoming Visit&apos;s</span>
            </h2>
            <div className="px-5">
              List upcoming visists ; todo
            </div>
          </div>
        </div>

        <div id="hero" className="rounded-lg mt-14 grid grid-cols-1 p-2 items-center bg-secondary border shadow-lg">
          <div>
            <h2 className="text-3xl leading-8 relative">
              {/* SVG */}
              <span className="ml-10">Past Visit&apos;s</span>
            </h2>
            <div className="px-5">
              List past visists ; todo
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Index;

export default function StatsSection() {
  return (
    <div className="bg-primary">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-white">1,200+</div>
            <div className="mt-2 text-xl text-primary-100">Internships</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-white">5,000+</div>
            <div className="mt-2 text-xl text-primary-100">Students</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="text-4xl font-bold text-white">300+</div>
            <div className="mt-2 text-xl text-primary-100">Companies</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div>
      <main className="text-gray-800 h-screen overflow-hidden">
        <div className="p-6 pt-0">
          <section>
            <div className="bg-dark border border-dark rounded p-3 content-body text-center">
              <h2>About</h2>
              <div className="text-xs p-8">
                <p className="font-medium">
                  Port&amp;PID was made because sometimes during web development
                  a local server will close in a weird way that it shuts down
                  but says the port is already in use. This app is designed to
                  search by Port and Kill PIDs as fast as possible to get back
                  to work.
                </p>
                <hr className="my-6" />
                <p>Version 1.0.0</p>
                <p>Developed by Wynter Jones</p>
                <p>https://minielectron.com/</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default About;

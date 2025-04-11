import './globals.css';


export default function Layout({ children }: { children: React.ReactNode }) {
      return (
            <html lang="en">
                  <head>
                        <title>My Project</title>
                  </head>
                  <body>
                        {children}
                  </body>
            </html>
      );
}
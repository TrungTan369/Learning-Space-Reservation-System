import './globals.css';


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <title>Quản lí không gian học</title>
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
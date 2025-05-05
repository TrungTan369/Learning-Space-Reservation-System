import { Suspense } from "react";
import RoomWrapper from "./roomWrapper";

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <RoomWrapper />
        </Suspense>
    );
}
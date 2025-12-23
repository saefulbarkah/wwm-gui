import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Esse reprehenderit ullam totam earum autem, atque
      possimus eveniet recusandae culpa commodi voluptatum. Vel animi temporibus adipisci. A consectetur quasi
      perspiciatis error!
    </div>
  );
}

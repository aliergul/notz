import TodoCard from "@/app/ui/todos/todo-card";
import TodoCreateButton from "@/app/ui/todos/todo-create-button";
import TodoHeader from "@/app/ui/todos/todo-header";
import Color from "color";

export default async function Todos() {
  const notStartedColor = Color("#f8f8f7");
  const inProgressColor = Color("#cbe2f0");
  const doneColor = Color("#d4e8d6");

  return (
    <main className="w-full mt-5 grid gap-6">
      <TodoCreateButton />
      <div className="flex justify-between gap-2">
        <div
          className="bg-red-300 w-1/3 p-2 rounded-lg"
          style={{ backgroundColor: notStartedColor.darken(0.1).hex() }}
        >
          <TodoHeader title="Not Started" color={notStartedColor.hex()} />
          <TodoCard />
        </div>

        <div
          className="w-1/3 p-2 rounded-lg"
          style={{ backgroundColor: inProgressColor.darken(0.1).hex() }}
        >
          <TodoHeader title="In Progress" color={inProgressColor.hex()} />
          <TodoCard />
        </div>

        <div
          className="w-1/3 p-2 rounded-lg"
          style={{ backgroundColor: doneColor.darken(0.1).hex() }}
        >
          <TodoHeader title="Done" color={doneColor.hex()} />
          <TodoCard />
        </div>
      </div>
    </main>
  );
}

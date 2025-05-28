"use client";

import { Button } from "@/app/ui/button";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import TodoDialog from "./todo-dialog";

export default function TodoCreateButton() {
  const [isOpen, setOpen] = useState<boolean>(false);
  return (
    <>
      <div id="create-task">
        <Button buttonType="default" onClick={() => setOpen(true)}>
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create a new task
        </Button>
      </div>
      <TodoDialog isOpen={isOpen} setOpen={setOpen} />
    </>
  );
}

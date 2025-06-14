"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Dispatch, Fragment, SetStateAction } from "react";
import { Button } from "../button";
import Input from "../input";
import Textarea from "../textarea";
import DateInput from "../components/date-input";
import { createTodo } from "@/app/lib/todo-actions";
import { useFormStatus } from "react-dom";

interface TodoDialogProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button buttonType="default" type="submit" disabled={pending}>
      {pending ? "Creating..." : "Create"}
    </Button>
  );
}

export default function TodoDialog({ isOpen, setOpen }: TodoDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={handleClose}>
        {/* Backdrop */}
        <TransitionChild>
          <div
            className="fixed inset-0 bg-black/30 transition duration-300 data-closed:opacity-0"
            onClick={handleClose}
          />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create a New Task
                </DialogTitle>
                <Description className="mt-2 text-sm text-gray-500">
                  Bu, yeni bir görev oluşturmak için gerekli bilgileri girmenize
                  olanak tanır.
                </Description>
                <p className="mt-2 text-sm text-gray-500">
                  Görev başlığı, açıklaması, durumu, etiketleri ve son tarihi
                  ekleyin.
                </p>

                <div className="mt-4">
                  <form action={createTodo} className="space-y-4">
                    <Input
                      label="Title"
                      name="title"
                      placeholder="Todo Title"
                      required
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Todo Description"
                    />
                    <DateInput
                      label="Task Due Date"
                      name="dueDate"
                      placeholder="Please pick a date"
                    />
                    <input type="hidden" name="priority" value="MEDIUM" />
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        buttonType="error"
                        type="button"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <SubmitButton />
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

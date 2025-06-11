"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import React, { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Button } from "../button";
import Input from "../input";
import Textarea from "../textarea";
import DateInput from "../components/date-input";

interface TodoDialogProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TodoDialog({ isOpen, setOpen }: TodoDialogProps) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dueDate, setDueDate] = useState<Date | null>(new Date());

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const submittedTitle = formData.get("title") as string;
    const submittedDescription = formData.get("description") as string;

    console.log("Gönderilen Veriler:", {
      title: title,
      description: description,
      dueDate: dueDate ? dueDate.toISOString() : null,
    });

    setTitle("");
    setDescription("");
    setDueDate(null);

    handleClose();
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                      label="Title"
                      name="title"
                      placeholder="Todo Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                    <Textarea
                      label="Description"
                      name="description"
                      placeholder="Todo Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />

                    <DateInput
                      label="Task Due Date"
                      name="due-date"
                      value={dueDate}
                      placeholder="Please pick a date"
                      onChange={(date) => setDueDate(date)}
                    />
                    <div className="flex justify-end gap-2 mt-6">
                      <Button
                        buttonType="error"
                        type="button"
                        onClick={handleClose}
                      >
                        Cancel
                      </Button>
                      <Button buttonType="default" type="submit">
                        Create
                      </Button>
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

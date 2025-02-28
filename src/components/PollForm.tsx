import { useState } from "react";
import Modal from "./Modal";
import Textarea from "./Textarea";
import { SubmitHandler, useForm } from "react-hook-form";
import { PlusIcon, XIcon } from "lucide-react";

const MAX_OPTION = 3;

interface Option {
  text: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

function PollForm({ onClose, visible }: Props) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<string[]>([]);

  const { register, handleSubmit, resetField } = useForm<Option>();
  const addOption: SubmitHandler<Option> = (data) => {
    setOptions((prev) => {
      if (prev.includes(data.text)) return prev;
      return [...prev, data.text];
    });
    resetField("text");
  };
  const removeOption = (option: string) => {
    setOptions((prev) => prev.filter((el) => el !== option));
  };

  return (
    <Modal onClose={onClose} visible={visible}>
      <p>Currently does not work, sorry</p>
      <h3 className="text-lg font-semibold">Create Poll</h3>

      <div className="relative">
        <Textarea
          value={question}
          handleChange={setQuestion}
          placeholder="Question"
        />
      </div>

      <section className="space-y-2">
        {options.map((el) => (
          <div key={el} className="border-base-content/20 flex border-b">
            <p>{el}</p>
            <button
              onClick={() => removeOption(el)}
              className="btn btn-square btn-error btn-outline btn-xs"
            >
              <XIcon />
            </button>
          </div>
        ))}
      </section>

      <form onSubmit={handleSubmit(addOption)} className="flex gap-3">
        <label className="floating-label grow">
          <input
            {...register("text", { required: true })}
            className="input w-full"
            placeholder="Option"
          />
          <span>Option</span>
          {options.length >= MAX_OPTION && (
            <p className="validator-hint text-error">Max option reached</p>
          )}
        </label>
        <button
          disabled={options.length >= MAX_OPTION}
          className="btn btn-dash"
        >
          <PlusIcon />
          Add Option
        </button>
      </form>

      <button className="btn btn-primary">Create Poll</button>
    </Modal>
  );
}

export default PollForm;

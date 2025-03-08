import { SearchIcon } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface Search {
  q: string;
}

/**
 * Reusability
 */
interface Props {
  className?: string;
}

function SearchForm({ className }: Props) {
  const { register, handleSubmit } = useForm<Search>();

  const handleSearch: SubmitHandler<Search> = ({ q }) => {
    console.log(q);
  };

  return (
    <form
      className={twMerge("input border-0 shadow-none", className)}
      onSubmit={handleSubmit(handleSearch)}
    >
      <SearchIcon className="opacity-80" />
      <input
        {...register("q", { required: true })}
        type="search"
        placeholder="Search on twittard..."
      />
    </form>
  );
}

export default SearchForm;

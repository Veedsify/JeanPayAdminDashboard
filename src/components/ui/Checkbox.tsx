export const Checkbox = (
  props: React.InputHTMLAttributes<HTMLInputElement>
) => (
  <input
    type="checkbox"
    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
    {...props}
  />
);

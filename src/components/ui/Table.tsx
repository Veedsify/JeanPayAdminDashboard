import { cn } from "@/lib/utils";

const Table: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div
    className={cn(
      "w-full overflow-auto rounded-lg bg-white", // Added rounded corners and shadow
      className,
    )}
  >
    <table className="w-full caption-bottom text-sm">{children}</table>
  </div>
);

const TableHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <thead
    className={cn(
      "[&_tr]:border-b [&_tr]:border-b-blue-100", // Softer border and header bg
      className,
    )}
  >
    {children}
  </thead>
);

const TableBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <tbody className={cn("[&_tr:last-child]:border-0", className)}>
    {children}
  </tbody>
);

const TableRow: React.FC<{
  children: React.ReactNode;
  className?: string;
  otherProps?: React.HTMLAttributes<HTMLTableRowElement>;
}> = ({ children, className, otherProps }) => (
  <tr
    {...otherProps}
    className={cn(
      "border-b border-gray-200 transition-colors", // Softer border, blue hover
      className,
    )}
  >
    {children}
  </tr>
);

const TableHead: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <th
    className={cn(
      "h-14 px-6 text-left align-middle font-semibold", // More padding, bold, blue text, top border
      className,
    )}
  >
    {children}
  </th>
);

const TableCell: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <td
    className={cn(
      "p-6 align-middle text-sm text-gray-700 [&:has([role=checkbox])]:pr-0", // More padding, softer text
      className,
    )}
  >
    {children}
  </td>
);

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };

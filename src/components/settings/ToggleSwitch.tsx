import { motion } from "framer-motion";
export const ToggleSwitch = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) => (
  <label
    className="relative inline-flex items-center cursor-pointer"
    data-state={enabled ? "checked" : "unchecked"}
  >
    <input
      type="checkbox"
      className="sr-only"
      checked={enabled}
      onChange={(e) => onChange(e.target.checked)}
    />
    <motion.div
      className={`w-9 h-5 md:w-11 md:h-6 rounded-full flex items-center ${
        enabled ? "bg-secondary justify-end" : "bg-gray-200 justify-start"
      }`}
      initial={false}
    >
      <motion.div
        layout
        transition={{
          x: { type: "spring", stiffness: 700, damping: 30 },
        }}
        className="bg-white h-4 w-4 md:h-5 md:w-5 rounded-full border border-gray-300 shadow-sm mx-[2px]"
        initial={false}
        animate={{
          x: enabled ? 0.9 : 0,
        }}
      />
    </motion.div>
  </label>
);

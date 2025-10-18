import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

const CartNotification = ({ show, message, onClose }) => {
  return (
    <div className="relative">
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 right-4 z-50 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl shadow-lg max-w-xs sm:max-w-sm"
          >
            <CheckCircle size={20} className="text-white" />
            <span className="flex-1 text-sm sm:text-base">{message}</span>
            <button
              onClick={onClose}
              className="ml-2 text-white hover:text-gray-200 focus:outline-none"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartNotification;

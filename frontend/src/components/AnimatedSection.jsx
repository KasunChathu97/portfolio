import { motion } from 'framer-motion';

const AnimatedSection = ({ children, className = "", id = "" }) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 80, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.15 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

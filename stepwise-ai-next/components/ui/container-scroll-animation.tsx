"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({ titleComponent, children }: { titleComponent: string | React.ReactNode; children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.82, 1] : [0.91, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -70]);

  return (
    <div className="container-scroll-wrap" ref={containerRef}>
      <div className="container-scroll-inner" style={{ perspective: "1000px" }}>
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} scale={scale}>{children}</Card>
      </div>
    </div>
  );
};

export const Header = ({ translate, titleComponent }: { translate: MotionValue<number>; titleComponent: React.ReactNode }) => (
  <motion.div style={{ translateY: translate }} className="scroll-header">{titleComponent}</motion.div>
);

export const Card = ({ rotate, scale, children }: { rotate: MotionValue<number>; scale: MotionValue<number>; children: React.ReactNode }) => (
  <motion.div style={{ rotateX: rotate, scale, boxShadow: "0 0 0 1px #4a4a4a, 0 24px 60px #00000070" }} className="container-scroll-card">
    <div className="container-scroll-content">{children}</div>
  </motion.div>
);

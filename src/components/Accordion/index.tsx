"use client"
import { useState, PropsWithChildren } from 'react';
import styles from './index.module.css'
import { FaChevronDown } from "react-icons/fa";

interface DynamicHeadingProps extends PropsWithChildren {
  titleSize: string;
  className?: string;
  onclick?: () => void;
}

export interface AccordionProps extends PropsWithChildren {
  title?: string;
  startsOpen?: boolean;
  showIcon?: boolean;
  isCollapsible?: boolean;
  titleSize?: string;
}

const DynamicHeading = ({ titleSize, className, onclick, children }: DynamicHeadingProps) => {
  const Tag = titleSize as keyof JSX.IntrinsicElements; // Type assertion for the Tag
  return (
    <Tag className={className} onClick={onclick}>
      {children}
    </Tag>
  );
}

const Accordion = ({
  title,
  startsOpen = true,
  showIcon = true,
  isCollapsible = true,
  titleSize = "h2",
  children,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(startsOpen);

  const toggleIsOpen = () => {
    if (isCollapsible) setIsOpen(prevState => !prevState)
  }

  return (
    <div className={styles.card}>
      <DynamicHeading
        titleSize={titleSize}
        className={`${styles.title} ${isCollapsible ? styles.collapsible : ""}`}
        onclick={isCollapsible ? toggleIsOpen : undefined}
      >
        {title}
        {showIcon && (
          <span className={`${styles.icon} ${isOpen ? styles.rotate : ""}`}>
            <FaChevronDown />
          </span>
        )}
      </DynamicHeading>
      <div className={`${styles.children} ${isOpen ? styles.expand : ""}`}>
        <div className={styles.contentWrapper}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
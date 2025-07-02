import React from "react";

import type { ComponentConfig } from "@/core";
import { getClassNameFactory } from "@/core/lib";

import styles from "./styles.module.css";

const getClassName = getClassNameFactory("Blank", styles);

export type BlankProps = {};

export const Blank: ComponentConfig<BlankProps> = {
	fields: {},
	defaultProps: {},
	render: () => {
		return <div className={getClassName()}></div>;
	},
};

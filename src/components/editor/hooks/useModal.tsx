/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type * as React from "react";
import { useCallback, useMemo, useState } from "react";

import Modal from "../ui/Modal";

export default function useModal(): [
	React.JSX.Element | null,
	(
		title: string,
		showModal: (onClose: () => void) => React.JSX.Element,
	) => void,
] {
	const [modalContent, setModalContent] = useState<null | {
		closeOnClickOutside: boolean;
		content: React.JSX.Element;
		title: string;
	}>(null);

	const onClose = useCallback(() => {
		setModalContent(null);
	}, []);

	const modal = useMemo(() => {
		if (modalContent === null) {
			return null;
		}
		const { title, content, closeOnClickOutside } = modalContent;
		return (
			<Modal
				onClose={onClose}
				title={title}
				closeOnClickOutside={closeOnClickOutside}
			>
				{content}
			</Modal>
		);
	}, [modalContent, onClose]);

	const showModal = useCallback(
		(
			title: string,

			getContent: (onClose: () => void) => React.JSX.Element,
			closeOnClickOutside = false,
		) => {
			setModalContent({
				closeOnClickOutside,
				content: getContent(onClose),
				title,
			});
		},
		[onClose],
	);

	return [modal, showModal];
}

import React, { useEffect, useRef } from 'react';
import TipTapMessage from './TipTapMessage';
import styles from '../chat.module.scss';
import { type Message } from '@ai-sdk/react';

interface ChatMessagesProps {
	messages: Message[];
	isLoading: boolean;
	onSuggestionClick?: (suggestion: string) => void;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({
	messages,
	isLoading,
	onSuggestionClick,
}) => {
	const bottomRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}, [messages]);

	const suggestions = [
		'Help me invest my tokens in a safe position',
		'Show me all my current holdings',
		"What's my total portfolio value right now?",
		'Show me the average APRs for all strategies',
	];

	const handleSuggestionClick = (suggestion: string) => {
		if (onSuggestionClick) {
			onSuggestionClick(suggestion);
		}
	};

	return (
		<div className={styles.chatMessagesWrapper}>
			<>
				<TipTapMessage
					message={{
						id: 'init-' + Date.now(),
						role: 'assistant',
						content: `Welcome to our smart tool.
Ask us all your questions, ask us about blockchain, apr, wallet and we will do our best to answer them.`,
					}}
					className={styles.welcomeText}
				/>

				{messages.length === 0 && (
					<div className={styles.suggestionContainer}>
						<p className={styles.suggestionTitle}>
							Try asking about:
						</p>
						<div className={styles.suggestionButtons}>
							{suggestions.map((suggestion, index) => (
								<button
									key={index}
									className={styles.suggestionButton}
									onClick={() =>
										handleSuggestionClick(suggestion)
									}>
									{suggestion}
								</button>
							))}
						</div>
					</div>
				)}

				{messages.map((msg, idx) => (
					<TipTapMessage
						message={msg}
						isLoading={isLoading && idx === messages.length - 1}
						key={idx}
					/>
				))}
			</>

			<div ref={bottomRef} />
		</div>
	);
};

export default ChatMessages;

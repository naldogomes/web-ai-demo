import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';

/** react-markdown passes its AST node as a prop; it must not reach the DOM. */
function withoutNode<T extends { node?: unknown }>({ node, ...props }: T) {
    void node;
    return props;
}

// Raw HTML in the model's answer is not rendered (react-markdown's safe default)
const components: Components = {
    a: (props) => <a {...withoutNode(props)} target="_blank" rel="noopener noreferrer" />,
    table: (props) => (
        <div className={styles.tableWrapper}>
            <table {...withoutNode(props)} />
        </div>
    ),
};

export function Markdown({ children }: { children: string }) {
    return (
        <div className={styles.markdown}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {children}
            </ReactMarkdown>
        </div>
    );
}

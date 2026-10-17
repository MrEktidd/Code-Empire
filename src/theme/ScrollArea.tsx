import type {HTMLAttributes} from 'react';

/** Consistent, native scroll behavior with Code Empire scrollbar styling.
 * Layout/overflow continue to be defined by caller CSS (e.g. .window-content).
 */
export function ScrollArea({className='',children,...props}:HTMLAttributes<HTMLDivElement>){
 return <div {...props} className={['ce-scroll',className].filter(Boolean).join(' ')}>{children}</div>;
}

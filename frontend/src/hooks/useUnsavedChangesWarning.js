// hooks/useUnsavedChangesWarning.js
import { useCallback, useEffect } from 'react';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import { useContext } from 'react';

export function useUnsavedChangesWarning(shouldBlock) {
    const navigator = useContext(NavigationContext).navigator;

    useEffect(() => {
        if (!shouldBlock) return;

        const pushState = window.history.pushState;
        const handleWindowClose = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        const unblock = navigator.block((tx) => {
            if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
                unblock();
                tx.retry();
            }
        });

        window.addEventListener('beforeunload', handleWindowClose);

        return () => {
            unblock();
            window.removeEventListener('beforeunload', handleWindowClose);
            window.history.pushState = pushState;
        };
    }, [navigator, shouldBlock]);
}

'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

const DialogContext = createContext();

const defaultOptions = {
    title: 'Success',
    type: 'success',
    okText: 'OK',
    iconClass: 'check_circle',
    showOkBtn: true,
    showCancelBtn: false,
    allowOutsideClick: true,
    autoHideDelay: 2000
};

const typeOverrides = {
    success: { title: 'Success' },
    error: { title: 'An error occurred', iconClass: 'error' },
    warning: { title: 'Warning', iconClass: 'error' },
    confirm: {
        title: 'Are You Sure?',
        okText: 'YES',
        showCancelBtn: true,
        iconClass: 'help'
    },
    progress: {
        title: 'Please wait...',
        showCancelBtn: false,
        showOkBtn: false,
        allowOutsideClick: false,
        iconClass: 'loading'
    }
};

export const DialogProvider = ({ children }) => {
    const [dialog, setDialog] = useState({});
    const [visible, setVisible] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const autoHideTimeout = useRef(null);
    const resolver = useRef({});
    const dialogRef = useRef();

    const cancelHandler = () => {
        setVisible(false);
        setIsHovered(false);
        if (dialog.type === 'confirm' && resolver.current.reject) {
            resolver.current.reject(false);
        } else {
            resolver.current.resolve?.(true);
        }
    };

    const okHandler = () => {
        resolver.current.resolve?.(true);
        setVisible(false);
    };

    const resetAutoHideTimeout = useCallback(
        (delay) => {
            clearTimeout(autoHideTimeout.current);
            if (dialog.type !== 'confirm') {
                autoHideTimeout.current = setTimeout(() => {
                    if (visible && !isHovered) {
                        cancelHandler();
                    }
                }, delay);
            }
        },
        [dialog.type, visible, isHovered]
    );

    const openDialog = useCallback(
        (message, options = {}) => {
            const autoHideDelay = options.autoHideDelay || defaultOptions.autoHideDelay;
            const mergedOptions = {
                ...defaultOptions,
                ...(typeOverrides[options.type] || {}),
                ...options,
                message,
                autoHideDelay
            };

            setVisible(true);
            setDialog(mergedOptions);

            return new Promise((resolve, reject) => {
                resolver.current = { resolve, reject };
                resetAutoHideTimeout(autoHideDelay);
            });
        },
        [resetAutoHideTimeout]
    );

    const outsideClickHandler = (e) => {
        if (dialog.allowOutsideClick && dialogRef.current && !dialogRef.current.contains(e.target)) {
            cancelHandler();
        }
    };

    useEffect(() => {
        if (visible) {
            document.addEventListener('mousedown', outsideClickHandler);
        } else {
            document.removeEventListener('mousedown', outsideClickHandler);
        }

        return () => document.removeEventListener('mousedown', outsideClickHandler);
    }, [visible, dialog.allowOutsideClick]);

    return (
        <DialogContext.Provider value={{ openDialog }}>
            {children}
            {visible && <div className="fixed inset-0 bg-black/30 z-[9998]"></div>}
            <div
                className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-300 ${
                    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}>
                <div
                    ref={dialogRef}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`w-[400px] min-h-[250px] p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-xl flex flex-col justify-start items-center gap-8 relative transition-all duration-300 dialog__container dialog__${dialog.type}`}>
                    <div className="dialog__content text-center w-full">
                        <div className="dialog__icon mx-auto mb-4">
                            {dialog.type === 'progress' ? (
                                <span className="dialog__loader border-t-4 border-4 border-white rounded-full w-11 h-11 animate-spin"></span>
                            ) : (
                                <span className="material-icons text-4xl bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 focus:outline-none">
                                    {dialog.iconClass}
                                </span>
                            )}
                        </div>
                        <div className="text-xl font-semibold text-gray-800 dark:text-white">{dialog.title}</div>
                        <div className="text-sm text-gray-700 dark:text-gray-300">{dialog.message}</div>
                    </div>

                    <div className="dialog__btn-group flex justify-center gap-4">
                        {dialog.showCancelBtn && (
                            <button
                                onClick={cancelHandler}
                                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">
                                CANCEL
                            </button>
                        )}
                        {dialog.showOkBtn && (
                            <button
                                onClick={okHandler}
                                className={`px-4 py-2 text-sm text-white rounded ${
                                    dialog.type === 'error'
                                        ? 'bg-gradient-to-r from-red-600 to-red-400'
                                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded hover:from-blue-600 hover:to-purple-700 focus:outline-none'
                                }`}>
                                {dialog.okText}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </DialogContext.Provider>
    );
};

export const useDialog = () => useContext(DialogContext);

export const onlyLetterRegex = /[a-zA-Z]+$/;

export const onlyNumberRegex = /^[0-9\b]+$/;

export const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6}/;

export const isUrlRegex = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;

export const phoneNumberRegex = /^[+0-9\b]+$/; // TODO: get better regex or use input mask

export const isValidUrl = (text) => {
    return /\b(http|https)/.test(text);
}

export const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(emailRegex);
};

export const validatePassword = (password) => {
    const passwordString = password || '';
    const isValid = false;
    if (passwordString.match(passwordRegex)) {
        isValid = true;
    }

    return isValid;
};

export const validateLetters = (fullString) => {
    const letterStrings = fullString || '';
    const isValid = false;
    if (letterStrings.match(onlyLetterRegex)) {
        isValid = true;
    }

    return isValid;
};

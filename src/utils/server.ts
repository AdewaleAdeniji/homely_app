export const parseError = (error: any) => {
  try {
    if (typeof error === "string") {
      return error;
    }
    if (error.response && error.response.status >= 500) {
      return "System error!";
    }
    if (error.response && error.response.data && error.response.data.error) {
      return error.response.data.error;
    }
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message;
    }
    if (error.response && error.response.data && error.response.data.errors) {
      if (error.response.data.errors.length > 0) {
        return error.response.data.errors[0].message;
      }
    }
    if (
      error.response &&
      error.response.data &&
      error.response.data.responseMessage
    ) {
      return error.response.data.responseMessage;
    }
    if (error.message) {
      return error.message;
    }
  } catch (err) {
    return "Sorry, service failed to process your request please try again";
  }
};

export const saveSession = ({
  accessToken,
  expiresIn,
}: {
  accessToken: string;
  expiresIn: number;
}) => {
  localStorage.setItem("accessToken", accessToken as string);
  localStorage.setItem("login_time", JSON.stringify(new Date().getTime()));
  localStorage.setItem("expiresIn", expiresIn.toString());
};

export const parseJwt = (token: string) => {
  let base64Url = token.split(".")[1];
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  let jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const getAuthFromLocalStorage = (strictCheckCoach: boolean = false) => {
  let auth = {
    user: null,
    isAuthenticated: false,
    coach: null,
  };

  try {
    const accessToken = localStorage.getItem("accessToken");
    const coach = getCoachSession(strictCheckCoach);
    if (accessToken) {
      const user = parseJwt(accessToken);

      auth = {
        ...auth,
        user,
        coach,
        isAuthenticated: user && coach.found,
      };
    }
  } catch (error) {
  } finally {
    return auth;
  }
};
export const setCoachSession = (coach: any) => {
  localStorage.setItem("coachy", JSON.stringify({ ...coach, found: true }));
};
export const getCoachSession = (strictCheckCoach: boolean = false) => {
  const coachy = localStorage.getItem("coachy");
  if (!coachy) {
    if(strictCheckCoach) {
      // done to do automatic logout if coach object is not present
    }
    return { found: false };
  }
  const coach = JSON.parse((localStorage.getItem("coachy") as string) || "");
  return { ...coach, found: true };
};
export const clearSession = () => {
  localStorage.clear();
  window.location.href = "/auth/login";
};

export const setClientOnboardingSession = (coach: any) => {
  localStorage.setItem("clientOnboarding", JSON.stringify({ ...coach, found: true }));
};
export const getClientOnboardinSession = () => {
  const coachy = localStorage.getItem("clientOnboarding");
  if (!coachy) {
    return { found: false };
  }
  const coach = JSON.parse((localStorage.getItem("coachy") as string) || "");
  return { ...coach, found: true };
};
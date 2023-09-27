import { useState } from "react";
import "./auth.scss";

//////////////
// TODO: turn form into MUI components instead of custom styling
//////////////

export default function SignUp() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    // passwordConfirmation: "",
  });

  const [passwordConfirm, setPasswordConfirm] = useState("");

  function updateForm(value: Object) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // TODO: move to /utils or /hooks
  async function registerUser(e: any) {
    // TODO: not any
    e.preventDefault();
    // setReadOnly(true);
    // setLoading(true);

    const newSignup = { ...form };

    const response = await fetch("SERVER_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSignup),
    }).catch((error) => {
      console.log(error);
      // setAlert(true);
      // setReadOnly(false);
      // setLoading(false);
    });

    setForm({ username: "", email: "", password: "" });
    setPasswordConfirm("");

    if (response) {
      const data = await response.json();

      if (data.status === "ok") {
        // receive the JWT and store it in cookies/local storage
        // setAlert(false);
        // navigate('/login');
      } else {
        // console.error('error');
        // setAlert(true);
        // setReadOnly(false);
        // setLoading(false);
      }
    }
  }

  return (
    <div className="overlay">
      <form onSubmit={registerUser} className="auth-modal">
        <label>
          <span>Username</span>
          <input
            value={form.username}
            onChange={(e) => updateForm({ username: e.target.value })}
            required
            type="text"
          />
        </label>
        <label>
          <span>Email</span>
          <input
            value={form.email}
            onChange={(e) => updateForm({ email: e.target.value })}
            required
            type="email"
          />
        </label>
        <label>
          <span>Password</span>
          <input
            value={form.password}
            onChange={(e) => updateForm({ password: e.target.value })}
            required
            type="password"
          />
        </label>
        <label>
          <span>Confirm Password</span>
          <input
            value={passwordConfirm}
            onChange={() => setPasswordConfirm("")}
            required
            type="password"
          />
        </label>

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}

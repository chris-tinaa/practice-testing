import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { toast } from "react-hot-toast";
import ProfilePage from "../src/app/profile/page";

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
  toast: {
    loading: jest.fn(() => "toast-id"),
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("ProfilePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
  });

  describe("Form Rendering", () => {
    it("should render the profile form with all required elements", () => {
      render(<ProfilePage />);
      
      expect(screen.getByRole("heading", { name: "Update Profile" })).toBeInTheDocument();
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();
      expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Bio")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    });

    it("should have inputs with correct types and attributes", () => {
      render(<ProfilePage />);
      
      expect(screen.getByLabelText("Username")).toHaveAttribute("type", "text");
      expect(screen.getByLabelText("Username")).toHaveAttribute("id", "username");
      expect(screen.getByLabelText("Full Name")).toHaveAttribute("type", "text");
      expect(screen.getByLabelText("Full Name")).toHaveAttribute("id", "fullName");
      expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
      expect(screen.getByLabelText("Email")).toHaveAttribute("id", "email");
      expect(screen.getByLabelText("Phone")).toHaveAttribute("type", "tel");
      expect(screen.getByLabelText("Phone")).toHaveAttribute("id", "phone");
      expect(screen.getByLabelText("Birth Date")).toHaveAttribute("type", "date");
      expect(screen.getByLabelText("Birth Date")).toHaveAttribute("id", "birthDate");
      expect(screen.getByLabelText("Bio")).toHaveAttribute("maxLength", "160");
      expect(screen.getByLabelText("Bio")).toHaveAttribute("id", "bio");
    });
  });

  describe("Form Interaction", () => {
    it("should update username when user types", () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      fireEvent.change(usernameInput, { target: { value: "johndoe123" } });
      
      expect(usernameInput).toHaveValue("johndoe123");
    });

    it("should update full name when user types", () => {
      render(<ProfilePage />);
      
      const fullNameInput = screen.getByLabelText("Full Name");
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      
      expect(fullNameInput).toHaveValue("John Doe");
    });

    it("should update email when user types", () => {
      render(<ProfilePage />);
      
      const emailInput = screen.getByLabelText("Email");
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      
      expect(emailInput).toHaveValue("john@example.com");
    });

    it("should update phone when user types", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      expect(phoneInput).toHaveValue("1234567890");
    });

    it("should update birth date when user selects", () => {
      render(<ProfilePage />);
      
      const birthDateInput = screen.getByLabelText("Birth Date");
      fireEvent.change(birthDateInput, { target: { value: "1990-01-01" } });
      
      expect(birthDateInput).toHaveValue("1990-01-01");
    });

    it("should update bio when user types", () => {
      render(<ProfilePage />);
      
      const bioInput = screen.getByLabelText("Bio");
      fireEvent.change(bioInput, { target: { value: "This is my bio" } });
      
      expect(bioInput).toHaveValue("This is my bio");
    });
  });

  describe("Form Validation", () => {
    it("should show error when username is less than 6 characters", () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      fireEvent.change(usernameInput, { target: { value: "short" } });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Username must be at least 6 characters.")).toBeInTheDocument();
    });

    it("should show error when full name is empty", () => {
      render(<ProfilePage />);
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Full name is required.")).toBeInTheDocument();
    });

    it("should show error when email format is invalid", () => {
      render(<ProfilePage />);
      
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      fireEvent.change(emailInput, { target: { value: "invalid-email" } });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Must be a valid email format.")).toBeInTheDocument();
    });

    it("should show error when phone format is invalid", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      fireEvent.change(phoneInput, { target: { value: "123" } });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
    });

    it("should show error when birth date is in the future", () => {
      render(<ProfilePage />);
      
      const birthDateInput = screen.getByLabelText("Birth Date");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      // Set a future date
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const futureDateString = futureDate.toISOString().split('T')[0];
      
      fireEvent.change(birthDateInput, { target: { value: futureDateString } });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Birth date cannot be in the future.")).toBeInTheDocument();
    });

    it("should show error when bio exceeds 160 characters", () => {
      render(<ProfilePage />);
      
      const bioInput = screen.getByLabelText("Bio");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      const longBio = "a".repeat(161);
      fireEvent.change(bioInput, { target: { value: longBio } });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Bio must be 160 characters or less.")).toBeInTheDocument();
    });

    it("should show multiple errors when multiple fields are invalid", () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      fireEvent.change(usernameInput, { target: { value: "short" } });
      fireEvent.change(emailInput, { target: { value: "invalid" } });
      fireEvent.change(phoneInput, { target: { value: "123" } });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Username must be at least 6 characters.")).toBeInTheDocument();
      expect(screen.getByText("Full name is required.")).toBeInTheDocument();
      expect(screen.getByText("Must be a valid email format.")).toBeInTheDocument();
      expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
    });

    it("should accept valid phone numbers within range", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      // Fill with valid data
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } }); // 10 digits
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.queryByText("Phone must be 10-15 digits.")).not.toBeInTheDocument();
    });

    it("should accept 15 digit phone numbers", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      // Fill with valid data
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "123456789012345" } }); // 15 digits
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.queryByText("Phone must be 10-15 digits.")).not.toBeInTheDocument();
    });

    it("should clear validation errors when valid input is provided", async () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      // First submit with invalid data
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      expect(screen.getByText("Full name is required.")).toBeInTheDocument();
      
      // Then provide valid data and submit again
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const formEl = document.querySelector("form")!;
      fireEvent.submit(formEl);
      
      await waitFor(() => {
        expect(screen.queryByText("Full name is required.")).not.toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    const fillValidForm = () => {
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "validuser123" } });
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
      fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "1234567890" } });
      fireEvent.change(screen.getByLabelText("Birth Date"), { target: { value: "1990-01-01" } });
      fireEvent.change(screen.getByLabelText("Bio"), { target: { value: "This is my bio" } });
    };

    it("should not submit form when validation fails", () => {
      render(<ProfilePage />);
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should submit form with correct data when validation passes", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "validuser123",
            fullName: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            birthDate: "1990-01-01",
            bio: "This is my bio",
          }),
        });
      });
    });

    it("should show loading toast when form is submitted", () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(toast.loading).toHaveBeenCalledWith("Updating profile...");
    });

    it("should show success toast when profile update is successful", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(toast.success).toHaveBeenCalledWith("Profile updated successfully!", { id: "toast-id" });
      });
    });

    it("should show error toast when profile update fails", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: "Username already exists" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Username already exists", { id: "toast-id" });
      });
    });

    it("should show generic error when no error message is provided", async () => {
      render(<ProfilePage />);
      
      fillValidForm();
      
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({}),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("An error occurred.", { id: "toast-id" });
      });
    });

    it("should submit form without optional fields", async () => {
      render(<ProfilePage />);
      
      // Fill only required fields
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "validuser123" } });
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
      fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated successfully" }),
      });
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith("/api/profile", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "validuser123",
            fullName: "John Doe",
            email: "john@example.com",
            phone: "1234567890",
            birthDate: "",
            bio: "",
          }),
        });
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle exactly 160 characters in bio", () => {
      render(<ProfilePage />);
      
      const bioInput = screen.getByLabelText("Bio");
      const exactlyValidBio = "a".repeat(160);
      
      fireEvent.change(bioInput, { target: { value: exactlyValidBio } });
      
      expect(bioInput).toHaveValue(exactlyValidBio);
      
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      // Fill other required fields
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.queryByText("Bio must be 160 characters or less.")).not.toBeInTheDocument();
    });

    it("should accept birth date as today", () => {
      render(<ProfilePage />);
      
      const birthDateInput = screen.getByLabelText("Birth Date");
      const today = new Date().toISOString().split('T')[0];
      
      fireEvent.change(birthDateInput, { target: { value: today } });
      
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      // Fill other required fields
      fireEvent.change(usernameInput, { target: { value: "validuser123" } });
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.queryByText("Birth date cannot be in the future.")).not.toBeInTheDocument();
    });

    it("should handle network error gracefully", async () => {
      render(<ProfilePage />);
      
      // Fill valid form
      fireEvent.change(screen.getByLabelText("Username"), { target: { value: "validuser123" } });
      fireEvent.change(screen.getByLabelText("Full Name"), { target: { value: "John Doe" } });
      fireEvent.change(screen.getByLabelText("Email"), { target: { value: "john@example.com" } });
      fireEvent.change(screen.getByLabelText("Phone"), { target: { value: "1234567890" } });
      
      mockFetch.mockRejectedValueOnce(new Error("Network error"));
      
      const submitButton = screen.getByRole("button", { name: "Update" });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("An error occurred.", { id: "toast-id" });
      });
    });

    it("should validate username minimum length exactly at 6 characters", () => {
      render(<ProfilePage />);
      
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const emailInput = screen.getByLabelText("Email");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      // Fill with valid data including exactly 6 character username
      fireEvent.change(usernameInput, { target: { value: "user12" } }); // exactly 6 chars
      fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(phoneInput, { target: { value: "1234567890" } });
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: "Profile updated" }),
      });
      
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.queryByText("Username must be at least 6 characters.")).not.toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper form labels", () => {
      render(<ProfilePage />);
      
      expect(screen.getByLabelText("Username")).toBeInTheDocument();
      expect(screen.getByLabelText("Full Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Email")).toBeInTheDocument();
      expect(screen.getByLabelText("Phone")).toBeInTheDocument();
      expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
      expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    });

    it("should have proper button role", () => {
      render(<ProfilePage />);
      
      expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
    });

    it("should have proper form structure", () => {
      render(<ProfilePage />);
      
      const form = screen.getByRole("button", { name: "Update" }).closest('form');
      expect(form).toBeInTheDocument();
      expect(form).toHaveAttribute('class', 'space-y-6');
    });
  });

  describe("Phone Validation Edge Cases", () => {
    it("should reject phone numbers with non-digit characters", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      fireEvent.change(phoneInput, { target: { value: "123-456-7890" } });
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
    });

    it("should reject phone numbers with less than 10 digits", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      fireEvent.change(phoneInput, { target: { value: "123456789" } }); // 9 digits
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
    });

    it("should reject phone numbers with more than 15 digits", () => {
      render(<ProfilePage />);
      
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      fireEvent.change(phoneInput, { target: { value: "1234567890123456" } }); // 16 digits
      const form = document.querySelector("form")!;
      fireEvent.submit(form);
      
      expect(screen.getByText("Phone must be 10-15 digits.")).toBeInTheDocument();
    });
  });

  describe("Email Validation Edge Cases", () => {
    it("should accept valid email formats", () => {
      render(<ProfilePage />);
      
      const emailInput = screen.getByLabelText("Email");
      const usernameInput = screen.getByLabelText("Username");
      const fullNameInput = screen.getByLabelText("Full Name");
      const phoneInput = screen.getByLabelText("Phone");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      const validEmails = [
        "user@example.com",
        "user.name@example.com",
        "user+tag@example.co.uk",
        "123@example.org"
      ];

      validEmails.forEach((email) => {
        // Fill with valid data
        fireEvent.change(usernameInput, { target: { value: "validuser123" } });
        fireEvent.change(fullNameInput, { target: { value: "John Doe" } });
        fireEvent.change(phoneInput, { target: { value: "1234567890" } });
        fireEvent.change(emailInput, { target: { value: email } });
        
        mockFetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: "Profile updated" }),
        });
        
      const formEl = document.querySelector("form")!;
      fireEvent.submit(formEl);
        
        expect(screen.queryByText("Must be a valid email format.")).not.toBeInTheDocument();
      });
    });

    it("should reject invalid email formats", () => {
      render(<ProfilePage />);
      
      const emailInput = screen.getByLabelText("Email");
      const submitButton = screen.getByRole("button", { name: "Update" });
      
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "user@",
        "user@example",
        "user.example.com"
      ];

      invalidEmails.forEach((email) => {
        fireEvent.change(emailInput, { target: { value: email } });
        const formEl = document.querySelector("form")!;
      fireEvent.submit(formEl);
        
        expect(screen.getByText("Must be a valid email format.")).toBeInTheDocument();
      });
    });
  });
});

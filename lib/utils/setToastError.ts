import { toast } from "sonner";

export default function setToastError(errorMessage: string) {
  let toastError =
    "Something unexpected happened. Please try again or contact support.";

  if (
    errorMessage.includes("relation") &&
    errorMessage.includes("does not exist")
  ) {
    toastError = "The requested resource does not exist.";
  } else if (errorMessage.includes("syntax error at or near")) {
    toastError = "There is a syntax error in your SQL query.";
  } else if (
    errorMessage.includes("duplicate key value violates unique constraint")
  ) {
    toastError = "A record with the same key already exists.";
  } else if (errorMessage.includes("null value in column")) {
    toastError = "You cannot insert a NULL value in a required field.";
  } else if (errorMessage.includes("division by zero")) {
    toastError = "Cannot divide by zero.";
  } else if (errorMessage.includes("could not connect to server")) {
    toastError = "Failed to connect to the database server.";
  } else if (errorMessage.includes("deadlock detected")) {
    toastError = "A deadlock situation occurred. Please try again later.";
  } else if (errorMessage.includes("permission denied for table")) {
    toastError =
      "You do not have permission to perform this operation on the table.";
  } else if (errorMessage.includes("already exists")) {
    toastError = "The resource you are trying to create already exists.";
  } else if (errorMessage.includes("specified more than once")) {
    toastError = "The column is specified more than once in the query.";
  } else if (errorMessage.includes("value too long for type")) {
    toastError = "The value provided is too long for the specified data type.";
  } else if (errorMessage.includes("invalid input syntax for type")) {
    toastError = "Invalid data format for the specified data type.";
  } else {
    toastError = "An error occurred. Please try again or contact support.";
  }

  toast.error(toastError);
}

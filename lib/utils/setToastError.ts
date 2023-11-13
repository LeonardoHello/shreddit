import { toast } from "sonner";

const setToastError = (
  errorMessage: string = "Something unexpected happened. Please try again or contact support.",
) => {
  switch (true) {
    case errorMessage.includes("relation") &&
      errorMessage.includes("does not exist"):
      errorMessage =
        "Oops! The resource you're looking for doesn't seem to exist. It might have vanished into thin air.";
      break;

    case errorMessage.includes("syntax error at or near"):
      errorMessage =
        "Whoops! There's a little hiccup in your SQL query. Please double-check the syntax.";
      break;

    case errorMessage.includes(
      "duplicate key value violates unique constraint",
    ):
      errorMessage = "Oops! This entry already exists. No need to double up!";
      break;

    case errorMessage.includes("null value in column"):
      errorMessage =
        "Hold on! You can't leave this field empty. It's required.";
      break;

    case errorMessage.includes("division by zero"):
      errorMessage =
        "Uh-oh! Dividing by zero is a no-go. Please use a non-zero divisor.";
      break;

    case errorMessage.includes("could not connect to server"):
      errorMessage =
        "Houston, we have a problem! We can't reach the database right now. Please check your connection.";
      break;

    case errorMessage.includes("deadlock detected"):
      errorMessage =
        "It seems we have a little traffic jam in our system. Please try your request again shortly.";
      break;

    case errorMessage.includes("permission denied for table"):
      errorMessage =
        "Sorry, you don't have permission to do that. It's like trying to enter a restricted area without access.";
      break;

    case errorMessage.includes("already exists"):
      errorMessage =
        "Oops! This resource is already in the database. No need to add it again.";
      break;

    case errorMessage.includes("specified more than once"):
      errorMessage =
        "Hold on! You mentioned this column multiple times. Once is enough!";
      break;

    case errorMessage.includes("value too long for type"):
      errorMessage =
        "This value is too lengthy for the database to handle. Please shorten it.";
      break;

    case errorMessage.includes("invalid input syntax for type"):
      errorMessage =
        "Sorry, the format of this data doesn't fit the bill. Please provide it in the expected format.";
      break;

    default:
      errorMessage =
        "Something unexpected happened. Please try again or contact support.";
  }

  toast.error(errorMessage);
};

export default setToastError;

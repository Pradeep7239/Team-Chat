export default function AuthForm({ title, fields, buttonText, onSubmit }) {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <form onSubmit={onSubmit} className="space-y-3">
        {fields}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}

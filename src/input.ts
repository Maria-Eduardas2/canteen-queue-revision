export async function prompt(msg: string): Promise<string> {
  process.stdout.write(msg);

  for await (const line of console) {
    return line.trim();
  }

  return "";
}

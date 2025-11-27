import { Card, Text, Group, Badge, Button, Center } from "@mantine/core";

const emojiMap = ["📕", "📗", "📘", "📙", "📔"];
const getEmoji = () => emojiMap[Math.floor(Math.random() * emojiMap.length)];

export default function BookCard({ book }) {
  const emoji = getEmoji();
  const isAvailable = book.estado === "DISPONIBLE";

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>

      <Center style={{ fontSize: "60px" }}>{emoji}</Center>

      <Text fw={700} size="lg" mt="md" ta="center">
        {book.titulo}
      </Text>

      <Text size="sm" c="dimmed" ta="center">
        {book.autor}
      </Text>

      <Group justify="center" mt="md">
        <Badge color={isAvailable ? "green" : "red"}>
          {book.estado}
        </Badge>
      </Group>

      {book.popularidad !== undefined && (
        <Text size="sm" mt="md" ta="center">
          ⭐ Popularidad: {book.popularidad}
        </Text>
      )}

      {book.colaReservas && book.colaReservas.length > 0 && (
        <Text size="sm" mt="sm" ta="center">
          ⏳ En cola: {book.colaReservas.length}
        </Text>
      )}

      <Button
        fullWidth
        mt="md"
        radius="md"
        color={isAvailable ? "blue" : "gray"}
      >
        {isAvailable ? "Reservar" : "Ver estado"}
      </Button>
    </Card>
  );
}

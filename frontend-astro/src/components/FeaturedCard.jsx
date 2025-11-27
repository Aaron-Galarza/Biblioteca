import { Card, Image, Text, Group, Badge, Button } from '@mantine/core';
import classes from '../styles/BookCard.module.css';

export default function BookCard({ book }) {
  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section>
        <Image src={book.url_imagen} alt={book.titulo} height={180} />
      </Card.Section>

      <Card.Section className={classes.section} mt="md">
        <Group justify="apart">
          <Text fz="lg" fw={500}>
            {book.titulo}
          </Text>
          <Badge size="sm" variant="light">
            {book.genero}
          </Badge>
        </Group>
        <Text fz="sm" mt="xs">
          {book.autor}
        </Text>
      </Card.Section>

      <Card.Section className={classes.section}>
        <Text mt="md" className={classes.label} c="dimmed">
          Descripción
        </Text>
        <Text fz="sm" mt="xs">
          {book.descripcion}
        </Text>
      </Card.Section>

      <Group mt="xs">
        <Button radius="md" style={{ flex: 1 }}>
          Ver más
        </Button>
      </Group>
    </Card>
  );
}
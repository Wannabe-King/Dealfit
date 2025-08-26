import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactElement } from "react";

export const ChartTile = ({
  title,
  children,
}: {
  title: string;
  children: ReactElement;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Visitors Per PPP Group</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

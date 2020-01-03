import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IACtivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

interface IProps {
  setEditMode: (editMode: boolean) => void;
  activity: IACtivity;
  createActivity: (activity: IACtivity) => void;
  editActivity: (activity: IACtivity) => void;
}

export const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: initialFormState,
  createActivity,
  editActivity
}) => {
  const initializeForm = () => {
    if (initialFormState) {
      return initialFormState;
    } else {
      return {
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: ""
      };
    }
  };

  const [activity, setActivity] = useState<IACtivity>(initializeForm);

  const handleSubmitChange = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid()
      };
      createActivity(newActivity);
    } else {
      editActivity(activity);
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmitChange}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          onChange={handleInputChange}
          name="description"
          rows={2}
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          name="category"
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputChange}
          name="date"
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputChange}
          name="city"
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          name="venue"
          placeholder="Venue"
          value={activity.venue}
        />
        <Button
          floated="right"
          positive
          type="Submit"
          content="Submit"
        ></Button>
        <Button
          onClick={() => setEditMode(false)}
          floated="right"
          type="Cancel"
          content="Cancel"
        ></Button>
      </Form>
    </Segment>
  );
};
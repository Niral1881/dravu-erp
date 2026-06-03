import Party from "../models/Party.js";

export const getParties = async (
  req,
  res
) => {
  try {

    const parties = await Party.find();

    res.json(parties);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const createParty = async (
  req,
  res
) => {
  try {

    const party = await Party.create(
      req.body
    );

    res.status(201).json(party);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateParty = async (
  req,
  res
) => {
  try {

    const party =
      await Party.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(party);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteParty = async (
  req,
  res
) => {
  try {

    await Party.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Party deleted",
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};
import Post from "../Models/PostModel.js";
import Order from "../Models/OrderModel.js";
import Case_History from "../Models/CaseHistory.js";


const HistoryCase = async (
  case_id,
  case_no,
  case_tittle,
  case_date,
  case_orders,
  user_name,
  Operation_name
) => {
  try {
    let data = new Case_History({
      case_id,
      case_no,
      case_tittle,
      case_date,
      case_orders,
      user_name,
      Operation_name
    });
    await data.save();
  } catch (err) {}
};

export const CreatPost = async (req, res) => {
  try {
    let { case_no, case_tittle, case_date, username, case_type ,Operation_name} = req.body;
    let string=case_no.trim()
     let find_data=await Post.findOne({case_no:string})
     if(!find_data){
        let data = new Post({
            case_no,
            case_tittle,
            case_date,
            sdem_name: username,
            case_type: case_type,
            Operation_name
          });
         
          await data.save();
          await HistoryCase(
            data._id,
            case_no,
            case_tittle,
            case_date,
            '',
            username,
            Operation_name
          );
          res.status(200).json({ message: "Create" });
     }else{
        res.status(500).json({ message: "Case number already  exit" });
     }
   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const UpdatePost = async (req, res) => {
  try {
    let { case_id, case_no, case_tittle, case_date, case_orders, user_name,Operation_name } =
      req.body;

    let finddata = await Post.findOne({ _id: case_id });
    if (finddata) {
      (finddata.case_no = case_no),
        (finddata.case_tittle = case_tittle),
        (finddata.case_date = case_date),
        (finddata.case_orders = case_orders);
      finddata.sdem_name = user_name;
      // finddata.Operation_name = Operation_name;
    }
    await HistoryCase(
      case_id,
      case_no,
      case_tittle,
      case_date,
      case_orders,
      user_name,
      Operation_name
    );
    await finddata.save();
    res.status(200).json({ message: "Update" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const DeletePost = async (req, res) => {
  try {
    let { case_id } = req.query;
    let finddata = await Post.findOne({ _id: case_id });
    if (finddata) {
      await Post.deleteOne({ _id: case_id });
    }
    res.status(200).json({ message: "Delete" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const GetPost = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const case_date = req.query.case_date
    ? { $regex: req.query.case_date, $options: "i" }
    : null;
  const case_no = req.query.case_no
    ? { $regex: req.query.case_no, $options: "i" }
    : null;
  const case_type = req.query.case_type
    ? { $regex: req.query.case_type, $options: "i" }
    : null;
  const sortField = req.query.sort || "_id";
  const sortOrder = req.query.order === "desc" ? -1 : 1;

  try {
    let pipeline = [];

    if (case_date || case_no || case_type) {
      let match = {};
      if (case_date) match.case_date = case_date;
      if (case_no) match.case_no = case_no;
      if (case_type) match.case_type = case_type;
      pipeline.push({ $match: match });
    }

    pipeline.push({ $sort: { [sortField]: sortOrder } });

    pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

    const products = await Post.aggregate(pipeline).allowDiskUse(true).exec();

    const totalPipeline = [];
    if (case_date || case_no || case_type) {
      let match = {};
      if (case_date) match.case_date = case_date;
      if (case_no) match.case_no = case_no;
      if (case_type) match.case_type = case_type;
      totalPipeline.push({ $match: match });
    }
    const total = await Post.aggregate(totalPipeline)
      .count("total")
      .allowDiskUse(true)
      .exec();

    res.json({
      products,
      currentPage: page,
      totalPages: Math.ceil(total[0]?.total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const CreatOrder = async (req, res) => {
  try {
    let { case_id, case_orders, user_name, case_date } = req.body;
    const Pdf = req?.files['Pdf'];
    let Pdf_data;
    if (Pdf) {
      Pdf_data=Pdf[0]
    }
    
    
    let data = new Order({
      case_id,
      case_orders,
      user_name,
      case_date,
      Pdf: Pdf?{
        data: Pdf_data.buffer,
        contentType: Pdf_data.mimetype,
        Pdf_id: Pdf_data.originalname,

      }:null,
    });
    await data.save();
    res.status(200).json({ message: "Create" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const PerticulerPdf = async (req, res) => {
  try {
    let { id } = req.params
    let postdata = await Order.find({ _id: id })
    let image1 = postdata[0].Pdf
    let imagedata;
    let contentType;

    if (image1 !== undefined) {
      imagedata = image1.data;
      contentType = image1.contentType
    } else {
      imagedata = null;
      contentType = null
    }

    if (imagedata === null) {
      return res.status(404).send({ message: "Image not found", status: false });
    } else {

      res.set('Content-Type', contentType);
      res.send(imagedata);
    }

  } catch (error) {
    console.error('Error retrieving image:', error);
    res.status(500).send('An error occurred');
  }


}

export const UpdateOrder = async (req, res) => {
  try {
    let { case_id, case_orders, case_date } = req.body;

    let data = await Order.findOne({
      _id: case_id,
    });

    if (data) {
      data.case_orders = case_orders;
      data.case_date = case_date;
      await data.save();
    }

    res.status(200).json({ message: "Update" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    let { case_id } = req.query;
    let data = await Order.find({ case_id: case_id }).sort({ _id: -1 });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCaseHistory = async (req, res) => {
  try {
    let { case_id } = req.query;
    let data = await Case_History.find({ case_id: case_id }).sort({ _id: -1 });
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const UpdateCaseStatus = async (req, res) => {
  try {
    let { case_id, case_no, case_tittle, case_date, case_orders, user_name } =
      req.body;

    let finddata = await Post.findOne({ _id: case_id });
    if (finddata) {
      finddata.case_status = true;
      finddata.case_end_date = case_date;
    }
    await HistoryCase(
      case_id,
      case_no,
      case_tittle,
      case_date,
      case_orders,
      user_name
    );
    await finddata.save();
    res.status(200).json({ message: "Update case status" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const Generate_Report = async (req, res) => {
    try {
      const { start_date, end_date } = req.query;

      if (!start_date || !end_date) {
        return res.status(400).json({
          success: false,
          message: "Please provide both start_date and end_date in query parameters",
        });
      }
  
  
      let pipeline = [
        {
          $match: {
            case_date: {
              $gte: start_date,  
              $lte: end_date,
            },
          },
        },
      ];
  
      let data = await Post.aggregate(pipeline);
     let all_data=data.map((item)=>{
        return{
            case:item.case_type,
            start:item.case_date,
            end:item.case_end_date ||'',
        }
     })
      res.status(200).json({ success: true, data:all_data });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  };
  
  
